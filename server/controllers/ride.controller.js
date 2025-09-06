const rideDAO  = require('../DAO/rideDAO');


// 2.1 创建帖子
exports.createRide = async (req, res) => {
    try {
        // console.log("req.user:", req.user); // 打印 JWT 解析出的用户信息
        // console.log("req.body:", req.body); // 打印前端发送的请求体

        const userId = req.user.id; // 从 JWT 中获取用户 ID
        const { type, location, destination, availableSeats, departure_time } = req.body;

        const postId = await rideDAO.createRide(userId, type, location, destination,departure_time, availableSeats);
        res.json({ message: "Post created successfully", postId });
       // console.log("创建成功")
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create ride" });
    }
};

// 2.2 获取所有帖子
exports.getAllRides = async (req, res) => {
    try {
        const { search, status } = req.query;
        const posts = await rideDAO.getAllRides(search, status);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

// 根据 ID 获取行程
exports.getRideById = async (req, res) => {
    try {
        const { id } = req.params;
        const ride = await rideDAO.getRideById(id);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }
        res.json(ride);
    } catch (err) {
        console.error("Error fetching ride by ID:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 2.3 编辑帖子
exports.updateRide = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { type,location, destination, availableSeats, departureTime,status} = req.body;
        //console.log( type,location, destination, availableSeats, departureTime,status)

        // 检查是否为该用户发布的帖子
        const ride = await rideDAO.getRideById(id);
        if (!ride) return res.status(404).json({ error: "Post not found" });
        if (ride.user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

        // 自动状态处理
        let newStatus = status;
        if (availableSeats === 0) {
            newStatus = "full";
        }

        await rideDAO.updateRide(id,type,location, destination, availableSeats,departureTime,newStatus);
        const updatedRide = await rideDAO.getRideById(id);
        res.json(updatedRide);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update post" });
    }
};

// 2.4 删除帖子
exports.deleteRide = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // 检查是否为该用户发布的帖子
        const ride = await rideDAO.getRideById(id);
        if (!ride) return res.status(404).json({ error: "Post not found" });
        if (ride.user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

        await rideDAO.deleteRide(id);
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete post" });
    }
};
