const throwError = (response, error, data) => {
    console.error(`Error occured: ${error}`);
    if (data) console.error(`Error details: ${JSON.stringify(data)}`);

    response.status(400);
    response.json({ error });
};

module.exports = {
    throwError
}