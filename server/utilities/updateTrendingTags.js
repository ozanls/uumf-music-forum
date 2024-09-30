// UpdateTrendingTags.js
// This function finds the 5 tags for each board with the most posts in the last 12 hours, and updates the TrendingTags table.

const { Op, fn, col, literal } = require('sequelize');
const { PostXTag, Tag, Board, TrendingTag } = require('../models');

async function updateTrendingTags() {
    const timeThreshold = new Date(new Date() - 60 * 60 * 1000 * 12); // 12 hours

    try {
        const boards = await Board.findAll();
        console.log('Boards:', boards);

        for (const board of boards) {
            const topTags = await PostXTag.findAll({
                attributes: [
                    'tagId',
                    [fn('COUNT', col('tagId')), 'tagCount']
                ],
                where: {
                    createdAt: {
                        [Op.gt]: timeThreshold
                    }
                },
                include: [{
                    model: Tag,
                    as: 'tag',
                    attributes: ['name'],
                    where: {
                        boardId: board.id
                    }
                }],
                group: ['tagId'],
                order: [[literal('tagCount'), 'DESC']],
                limit: 5
            });

            for (const tag of topTags) {
                const [trendingTag, created] = await TrendingTag.findOrCreate({
                    where: {
                        boardId: board.id,
                        tagId: tag.tagId
                    },
                    defaults: {
                        count: tag.get('tagCount'),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });

                if (!created) {
                    await trendingTag.update({
                        count: tag.get('tagCount'),
                        updatedAt: new Date()
                    });
                }

                const trendingTags = await TrendingTag.findAll({
                    where: {
                        boardId: board.id
                    },
                    include: [{
                        model: Tag,
                        as: 'tag',
                        attributes: ['name']
                    }]
                });

                return trendingTags;
            }
        }
    } catch (error) {
        console.error('Error updating trending tags:', error);
    }
}

module.exports = updateTrendingTags;