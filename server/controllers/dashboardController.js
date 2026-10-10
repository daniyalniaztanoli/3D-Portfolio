const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Experience = require("../models/Experience");
const Education = require("../models/Education");
const Service = require("../models/Service");
const Message = require("../models/Message");

const getDashboardStats = async (req, res) => {
  try {
    const [
      projects,
      skills,
      experiences,
      educations,
      services,
      messages,
      unreadMessages,
      recentProjects,
      recentMessages,
    ] = await Promise.all([
      Project.countDocuments(),

      Skill.countDocuments(),

      Experience.countDocuments(),

      Education.countDocuments(),

      Service.countDocuments(),

      Message.countDocuments(),

      Message.countDocuments({
        status: "unread",
      }),

      Project.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "title image category status featured createdAt"
        ),

      Message.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "name email subject status createdAt"
        ),
    ]);

    res.status(200).json({
      success: true,

      stats: {
        projects,
        skills,
        experiences,
        educations,
        services,
        messages,
        unreadMessages,
      },

      recentProjects,

      recentMessages,
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard data",
    });
  }
};

module.exports = {
  getDashboardStats,
};