"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const statistics_service_1 = require("../services/statistics.service");
const getStats = async (req, res, next) => {
    try {
        const stats = await (0, statistics_service_1.getStatistics)();
        res.json(stats);
    }
    catch (err) {
        next(err);
    }
};
exports.getStats = getStats;
