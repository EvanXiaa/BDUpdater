async.doWhilst(
            (loopCallback) => {
                smapiMethod(...callArgv, queryParams, (err, res) => {
                    if (err) {
                        return loopCallback(err, null);
                    }
                    if (res.statusCode >= 300) {
                        // TODO stringify the body
                        return loopCallback(res.body, null);
                    }
                    const parseResult = responseHandle(res);
                    queryParams.nextToken = parseResult.nextToken;
                    result[responseAccessor] = result[responseAccessor].concat(parseResult.listResult);
                    loopCallback(null, result);
                });
            },
            () => queryParams.nextToken,
            (err, res) => callback(err, err ? null : res)
        );