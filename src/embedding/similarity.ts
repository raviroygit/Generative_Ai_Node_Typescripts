import { DataWithEmbeddings, generateEmbedding, loadJsonData } from "./embedding";

// way 1 to find the similarity of best result of ask question
export function dotProduct(a: number[], b: number[]) {
  return a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
}

// way 2 (using cosine) to find the similarity of best result of ask question

 function  cosineSimilarity(a:number[],b:number[]){
    const product = dotProduct(a,b);
    const aMagnitude = Math.sqrt(a.map((value)=> value *value).reduce((a,b)=> a+b,0));
    const bMagnitude = Math.sqrt(b.map(value=> value*value).reduce((a,b)=> a+b,0));
    return product/aMagnitude*bMagnitude;
}

async function main(){
    const dataWithEmbeddings = loadJsonData<DataWithEmbeddings[]>('raviDataWithEmbeddings.json');

    const input="how old are ravi?";

    const inputEmbedding = await generateEmbedding(input);

    const similarities:{
        input:string,
        similarity: number
    }[]=[];

    for( const entry of dataWithEmbeddings){
        const similarity = cosineSimilarity(entry.embedding, inputEmbedding.data[0].embedding);
        similarities.push({
            input:entry.input,
            similarity
        })
    }

    console.log(`Similarity of ${input} with: `)
    const sortedSimilarities = similarities.sort((a,b)=> b.similarity - a.similarity);

    sortedSimilarities.forEach(similarity=>{
        console.log(`${similarity.input}: ${similarity.similarity}`)
    })
}

// main();