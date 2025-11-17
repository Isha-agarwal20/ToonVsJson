/**
 * Sample data sets for comparing JSON vs Toon formats
 */

export const samples = {
    // Simple user list
    userList: {
        users: [
            { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", active: true },
            { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user", active: true },
            { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "user", active: false },
            { id: 4, name: "Diana Prince", email: "diana@example.com", role: "moderator", active: true },
            { id: 5, name: "Eve Wilson", email: "eve@example.com", role: "user", active: true }
        ]
    },

    // E-commerce order
    order: {
        orderId: "ORD-2024-001",
        customer: {
            id: 12345,
            name: "John Doe",
            email: "john.doe@email.com",
            address: {
                street: "123 Main St",
                city: "New York",
                state: "NY",
                zip: "10001",
                country: "USA"
            }
        },
        items: [
            { productId: "PROD-001", name: "Laptop", quantity: 1, price: 999.99, discount: 10 },
            { productId: "PROD-002", name: "Mouse", quantity: 2, price: 29.99, discount: 0 },
            { productId: "PROD-003", name: "Keyboard", quantity: 1, price: 79.99, discount: 5 },
            { productId: "PROD-004", name: "Monitor", quantity: 2, price: 299.99, discount: 15 }
        ],
        payment: {
            method: "credit_card",
            status: "completed",
            total: 1709.94
        },
        shipping: {
            method: "express",
            cost: 25.00,
            estimatedDays: 2
        }
    },

    // API response
    apiResponse: {
        status: "success",
        code: 200,
        data: {
            page: 1,
            totalPages: 10,
            itemsPerPage: 20,
            totalItems: 200,
            results: [
                { id: 101, title: "First Post", views: 1500, likes: 45, published: true },
                { id: 102, title: "Second Post", views: 2300, likes: 78, published: true },
                { id: 103, title: "Third Post", views: 890, likes: 23, published: false },
                { id: 104, title: "Fourth Post", views: 3400, likes: 92, published: true },
                { id: 105, title: "Fifth Post", views: 1200, likes: 34, published: true }
            ]
        },
        metadata: {
            requestId: "req-abc123",
            timestamp: "2024-01-15T10:30:00Z",
            processingTime: 45
        }
    },

    // Configuration file
    config: {
        app: {
            name: "MyApplication",
            version: "2.1.0",
            environment: "production"
        },
        database: {
            host: "db.example.com",
            port: 5432,
            name: "myapp_db",
            user: "dbuser",
            ssl: true,
            poolSize: 10
        },
        cache: {
            enabled: true,
            type: "redis",
            host: "cache.example.com",
            port: 6379,
            ttl: 3600
        },
        logging: {
            level: "info",
            format: "json",
            destinations: ["console", "file", "elasticsearch"]
        },
        features: {
            authentication: true,
            rateLimit: true,
            analytics: true,
            notifications: false
        }
    },

    // Nested data structure
    company: {
        name: "Tech Corp",
        founded: 2010,
        employees: 500,
        departments: [
            {
                name: "Engineering",
                headCount: 200,
                teams: [
                    { name: "Backend", members: 50, lead: "Alice Smith" },
                    { name: "Frontend", members: 40, lead: "Bob Johnson" },
                    { name: "DevOps", members: 30, lead: "Charlie Brown" },
                    { name: "QA", members: 35, lead: "Diana Prince" },
                    { name: "Mobile", members: 45, lead: "Eve Wilson" }
                ]
            },
            {
                name: "Sales",
                headCount: 150,
                teams: [
                    { name: "Enterprise", members: 60, lead: "Frank Miller" },
                    { name: "SMB", members: 50, lead: "Grace Lee" },
                    { name: "Partners", members: 40, lead: "Henry Davis" }
                ]
            },
            {
                name: "Marketing",
                headCount: 80,
                teams: [
                    { name: "Digital", members: 30, lead: "Iris Chen" },
                    { name: "Content", members: 25, lead: "Jack Wilson" },
                    { name: "Events", members: 25, lead: "Kelly Brown" }
                ]
            }
        ],
        locations: ["New York", "San Francisco", "London", "Tokyo", "Berlin"],
        products: [
            { name: "Product A", category: "Software", price: 99.99, active: true },
            { name: "Product B", category: "Hardware", price: 499.99, active: true },
            { name: "Product C", category: "Service", price: 29.99, active: false }
        ]
    },

    // Large dataset
    largeDataset: {
        records: Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            username: `user${i + 1}`,
            email: `user${i + 1}@example.com`,
            age: 20 + (i % 50),
            country: ["USA", "UK", "Canada", "Australia", "Germany"][i % 5],
            subscribed: i % 2 === 0,
            lastLogin: `2024-01-${String((i % 30) + 1).padStart(2, '0')}`,
            score: Math.floor(Math.random() * 1000)
        }))
    }
};

export default samples;
