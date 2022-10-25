async function load() {
    const data = await new Promise(
        function (resolve) {
            setTimeout(() => resolve([1, 2, 3]), 10);
        }).
        then(data => data.map(i => i * 10));
    console.log(`Data inside the function: ${JSON.stringify(data)}`);
    return data;
}

async function main() {
    const data = await load();
    console.log(`Loaded data: ${JSON.stringify(data)}`);
}

await main();