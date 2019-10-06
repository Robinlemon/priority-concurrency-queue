module.exports = {
    hooks: {
        'pre-commit': 'npm run build && npm run lint && npm test && npm run build',
    },
};
