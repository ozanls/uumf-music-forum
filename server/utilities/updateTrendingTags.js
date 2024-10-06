// UpdateTrendingTags.js
// This function finds the 5 tags for each board with the most posts in the last 24 hours, and updates the TrendingTags table.

const { Op, fn, col, literal } = require("sequelize");
const { PostTag, Tag, Board, TrendingTag } = require("../models");

async function updateTrendingTags() {
  const timeThreshold = new Date(new Date() - 60 * 60 * 1000 * 24); // 24 hours

  try {
    const boards = await Board.findAll();
    console.log("Boards:", boards);

    for (const board of boards) {
      const topTags = await PostTag.findAll({
        attributes: ["tagId", [fn("COUNT", col("tagId")), "tagCount"]],
        where: {
          createdAt: {
            [Op.gt]: timeThreshold,
          },
        },
        include: [
          {
            model: Tag,
            as: "tag",
            attributes: ["name"],
            where: {
              boardId: board.id,
            },
          },
        ],
        group: ["tagId", "tag.id", "tag.name"],
        order: [[literal("tagCount"), "DESC"]],
        limit: 5,
      });

      const topTagIds = topTags.map((tag) => tag.tagId);

      for (const tag of topTags) {
        const [trendingTag, created] = await TrendingTag.findOrCreate({
          where: {
            boardId: board.id,
            tagId: tag.tagId,
          },
          defaults: {
            count: tag.get("tagCount"),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        if (!created) {
          await trendingTag.update({
            count: tag.get("tagCount"),
            updatedAt: new Date(),
          });
        }
      }

      await TrendingTag.destroy({
        where: {
          boardId: board.id,
          tagId: {
            [Op.notIn]: topTagIds,
          },
        },
      });

      console.log(`Updated trending tags for board ${board.id}`);
    }
  } catch (error) {
    console.error("Error updating trending tags:", error);
  }
}

module.exports = updateTrendingTags;
