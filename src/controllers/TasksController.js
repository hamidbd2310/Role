const TaskModel = require('../models/TasksModel');

exports.createTask = async (req, res) => {
    try {
        let reqBody = req.body;
        reqBody.email = req.headers['email']; 
        
        const task = await TaskModel.create(reqBody);
        res.status(201).send(task);
    } catch (err) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: err.message });
    }
};


exports.AllTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find({ email: req.headers['email'] });
        res.status(200).json({ status: "Success", data: tasks });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: err.message });
    }
};

exports.readTasks = async (req, res) => {
    try {
        const task = await TaskModel.findOne({ _id: req.params.id, email: req.headers['email'] });
        if (!task) {
            return res.status(404).json({ status: "Failed", message: "Task not found." });
        }
        res.status(200).json({ status: "Success", data: task });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await TaskModel.findOneAndUpdate(
            { _id: req.params.id, email: req.headers['email'] },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ status: "Failed", message: "Task not found." });
        }
        res.status(200).json({ status: "Success", data: task });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await TaskModel.findOneAndDelete({ _id: req.params.id, email: req.headers['email'] });
        if (!task) {
            return res.status(404).json({ status: "Failed", message: "Task not found." });
        }
        res.status(200).json({ status: "Success", message: "Task deleted successfully." });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: err.message });
    }
};

exports.getTasksByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const tasks = await TaskModel.find({ email: req.headers['email'], status: status });
        res.status(200).json({ status: "Success", data: tasks });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: err.message });
    }
};


exports.countTasksByStatus = async (req, res) => {
    try {
        const email = req.headers['email'];
        
        const taskCounts = await TaskModel.aggregate([
            { $match: { email: email } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const totalCount = taskCounts.reduce((sum, task) => sum + task.count, 0);

        res.status(200).json({ status: "Success", data: taskCounts, total: totalCount });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: err.message });
    }
};
