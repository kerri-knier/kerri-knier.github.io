import {useEffect, useState} from "react";
import {GetPosts, NewPost} from "./API";

export interface PostText {
    text: string
}

export type Post = {
    id: string
    SK: string // date
    text: string
}

export function Posts() {
    const [posts, setPosts] = useState([] as Post[])

    useEffect(() => {
        async function initialisePosts() {
            const r = await GetPosts()
            console.log("got posts")
            setPosts(r.filter( (s: Post) =>{
                console.log(s)
                console.log("has text")
                console.log(s.text)
                return s.text
            }))
        }

        initialisePosts()
    }, []);

    const appendPost = (newPost: string) => {
        if (!newPost) {
            return
        }

        NewPost(newPost).then(result => {
            if (!result.text) {
                return
            }
            
            setPosts(posts.concat(result))
        })
    }

    console.log("rendering")
    return (
        <>
            <CreatePost onNewPost={appendPost}/>
            <ul>{posts.sort((a,b) => a.SK < b.SK ? 1:-1).map(post => <PostItem key={post.id} post={post}/>)}</ul>
        </>
    );
}

export function PostItem({post}: {post:Post}) {
    let date = parseDate(post.SK)

    return <li>
        <div className="date">
        {date} 
        </div>
        <p>
        {post.text}
        <br></br>
        </p>
        </li>
}

function parseDate(sk: string) : string {
    let datepart = sk.split("#")[1]
    let date = new Date(datepart)
    let day = date.getDate()
    let month = date.toLocaleString('default', { month: "long" })
    let year = date.getFullYear()

    return day + " " + month + " " + year
}


export function CreatePost({onNewPost}: any) {

    const [newPost, setNewPost] = useState("")

    const appendPost = () => {
        onNewPost(newPost)
        setNewPost("");
    };

    return (
        <div className={"postForm"}>
            <textarea className={"postInput"}
                   placeholder="Create post"
                   value={newPost}
                   onChange={e => {
                       setNewPost(e.target.value);
                   }}
            />
            <button className={"postButton"} type="submit" onClick={appendPost}>Save</button>
        </div>
    );
}