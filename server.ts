import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("cafe_ravli.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    item_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    table_number TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/reviews", (req, res) => {
    const reviews = db.prepare("SELECT * FROM reviews ORDER BY created_at DESC").all();
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { customer_name, rating, comment, item_name } = req.body;
    if (!customer_name || !rating) {
      return res.status(400).json({ error: "Name and rating are required" });
    }
    const info = db.prepare(
      "INSERT INTO reviews (customer_name, rating, comment, item_name) VALUES (?, ?, ?, ?)"
    ).run(customer_name, rating, comment, item_name || null);
    
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/orders", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    const ordersWithItems = orders.map((order: any) => {
      const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
      return { ...order, items };
    });
    res.json(ordersWithItems);
  });

  app.post("/api/orders", (req, res) => {
    const { customer_name, table_number, total_amount, items } = req.body;
    
    if (!customer_name || !table_number || !items || !items.length) {
      return res.status(400).json({ error: "Missing order details" });
    }

    const transaction = db.transaction(() => {
      const orderInfo = db.prepare(
        "INSERT INTO orders (customer_name, table_number, total_amount) VALUES (?, ?, ?)"
      ).run(customer_name, table_number, total_amount);
      
      const orderId = orderInfo.lastInsertRowid;
      
      const insertItem = db.prepare(
        "INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)"
      );
      
      for (const item of items) {
        insertItem.run(orderId, item.name, item.quantity, item.price);
      }
      
      return orderId;
    });

    try {
      const orderId = transaction();
      res.json({ id: orderId });
    } catch (err) {
      console.error("Order transaction failed", err);
      res.status(500).json({ error: "Failed to save order" });
    }
  });

  app.get("/api/reservations", (req, res) => {
    const reservations = db.prepare("SELECT * FROM reservations ORDER BY date ASC, time ASC").all();
    res.json(reservations);
  });

  app.post("/api/reservations", (req, res) => {
    const { customer_name, phone, date, time, guests } = req.body;
    
    if (!customer_name || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: "Missing reservation details" });
    }

    try {
      const info = db.prepare(
        "INSERT INTO reservations (customer_name, phone, date, time, guests) VALUES (?, ?, ?, ?, ?)"
      ).run(customer_name, phone, date, time, guests);
      
      res.json({ id: info.lastInsertRowid });
    } catch (err) {
      console.error("Reservation failed", err);
      res.status(500).json({ error: "Failed to save reservation" });
    }
  });

  app.patch("/api/reservations/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
      db.prepare("UPDATE reservations SET status = ? WHERE id = ?").run(status, id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.patch("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
      // We might need to add a status column to orders first if it doesn't exist
      // For now let's assume we add it in the initialization
      db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPass = process.env.ADMIN_PASSWORD || "ravli2026";
    
    if (password === adminPass) {
      res.json({ success: true, token: "fake-jwt-token-for-demo" });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    try {
      const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as any;
      const totalRevenue = db.prepare("SELECT SUM(total_amount) as sum FROM orders").get() as any;
      const totalReservations = db.prepare("SELECT COUNT(*) as count FROM reservations").get() as any;
      const pendingReservations = db.prepare("SELECT COUNT(*) as count FROM reservations WHERE status = 'pending'").get() as any;
      const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get() as any;
      
      res.json({
        totalOrders: totalOrders.count,
        totalRevenue: totalRevenue.sum || 0,
        totalReservations: totalReservations.count,
        pendingReservations: pendingReservations.count,
        pendingOrders: pendingOrders.count
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
