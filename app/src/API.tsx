import { Post } from "./Post";

const api_url = "https://iro3uz0wu6.execute-api.eu-west-2.amazonaws.com/dev"
const posts_api = api_url+"/post"



export async function GetPosts() {

    try {
        console.log("fetching")
        const response = await fetch(posts_api);
        console.log("getting response json")
        const results = await response.json()
        console.log("result:")
        console.log(results)

        return results

    } catch (e) {
        console.error("failed to get posts:", e)
        return []
    }

}

export async function NewPost(text: string) : Promise<Post> {

    try {
        let body = JSON.stringify(text)

        console.log("posting: "+text)
        const response = await fetch(posts_api, {
            method: "POST",
            body: body,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        });
        const result = await response.json()
        console.log("result:")
        console.log(result)
        return result

    } catch (e) {
        console.error("failed to create post:", e)
        return {id: "", SK: "", text: ""}
    }
}