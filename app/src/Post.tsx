import {useEffect, useState} from "react";
import {GetPosts} from "./API";

export interface PostText {
    text: string
}

export function Posts() {
    const [posts, setPosts] = useState([] as string[])

    useEffect(() => {
        async function initialisePosts() {
            const r = await GetPosts()
            console.log("got posts")
            setPosts(r)
        }

        initialisePosts()
    }, []);

    const appendPost = (newPost: string) => {
        if (newPost === "") {
            return
        }

        setPosts(posts.concat(newPost))
    }

    console.log("rendering")
    // TODO use post ids as list keys
    return (
        <>
            <CreatePost onNewPost={appendPost}/>
            <ul>{posts.map(post => <Post key={post} text={post}/>).reverse()}</ul>
        </>
    );
}

export function Post({text}: PostText) {
    return <li> {text} </li>
}


export function CreatePost({onNewPost}: any) {

    const [newPost, setNewPost] = useState("")

    const appendPost = (event: any) => {
        event.preventDefault();
        onNewPost(newPost)
        event.target.reset();
        setNewPost("");
    };

    return (
        <form className={"postForm"} onSubmit={appendPost}>
            <input className={"postInput"}
                   type="text"
                   placeholder="Create post"
                   onChange={e => {
                       setNewPost(e.target.value);
                   }}
            />
            <button className={"postButton"} type="submit">Save</button>
        </form>
    );
}