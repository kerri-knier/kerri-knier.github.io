const api_url = "https://iro3uz0wu6.execute-api.eu-west-2.amazonaws.com/dev"

export async function GetPosts() {

    try {
        console.log("fetching")
        const response = await fetch(api_url+"/post");
        console.log("getting response json")
        const result = await response.json()
        console.log("result:")
        console.log(result)
        return result

    } catch (e) {
        console.error("failed to get posts:", e)
        return []
    }

}