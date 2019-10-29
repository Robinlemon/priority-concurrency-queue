module.exports = {
    hooks: {
        'pre-commit': 'npm run lint && npm test && npm run build',
    },
};
