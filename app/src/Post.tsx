import {useEffect, useState} from "react";
import {GetPosts} from "./API";

const initialPosts = [
    "my first post",
    "my second post",
    "my third post",
    "my fourth and extra long post about anything and everything because now its making sense",
    "my fifth post",
    "my sixth post",
    "my seventh post",
    "my eighth post",
    "my ninth post",
    "my tenth post",
]

export interface PostText {
    text: string
}

export function Posts() {
    const [posts, setPosts] = useState(initialPosts)

    useEffect(() => {
        GetPosts().then(r => {
            console.log("got posts")
            setPosts(r)
        })
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
            <ul>{posts.map(post => <Post text={post}/>).reverse()}</ul>
        </>
    );
}

export function Post({text}: PostText) {
    return <li key={text}> {text} </li>
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