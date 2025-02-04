export default trimBody;

function trimBody(body: any) {
    if (Object.prototype.toString.call(body) === '[object Object]') {
        Object.keys(body).forEach(function (key: string): any {
            var value = body[key];

            if (typeof value === 'string')
                return body[key] = value.trim();

            if (typeof value === 'object')
                trimBody(value);
        });
    }
}