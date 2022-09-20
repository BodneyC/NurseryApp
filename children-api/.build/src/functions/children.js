import middy from '@middy/core';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddbClient } from '@libs/ddbClient';
import { ddbDocClient } from '@libs/ddbDocClient';
const childrenPutFunction = async (event) => {
    console.log(event.body);
    const newKidParams = {
        TableName: "children-api-dev",
        Item: {
            primaryKey: "'Id': 2",
            sortKey: "'Name': Antia",
            Birthday: "05/03/2022",
        },
    };
    const data = await ddbDocClient.send(new PutCommand(newKidParams));
    console.log("Success - item added or updated", data);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'New children added',
            input: event,
        }, null, 2),
    };
};
const childrenGetFunction = async (event) => {
    console.log("INFO: Starting children handler");
    try {
        const getParams = {
            ProjectionExpression: "Name, Surname",
            TableName: "children-api-dev",
        };
        console.log(getParams);
        const data = await ddbClient.send(new QueryCommand(getParams));
        console.log(data.Items);
        data.Items.forEach(function (element) {
            console.log(element.Name.S + " (" + element.Surname.S + ")");
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
            }, null, 2),
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'An error has ocurred',
                message: err,
            }, null, 2),
        };
    }
};
export const getChildren = middy(childrenGetFunction);
export const createChildren = middy(childrenPutFunction);
//# sourceMappingURL=children.js.map