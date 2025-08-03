import {useEffect, useState} from "react";
import {GetPosts, NewPost} from "./API";
import { useAuth } from "react-oidc-context";

export interface PostText {
    text: string
}

export type Post = {
    PK: string // post id
    SK: string // type id
    text: string
    month: string
    created: string
}

export function Posts({isAuthenticated}: {isAuthenticated: boolean}) {
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

    const appendPost = (jwt: string, newPost: string) => {
        if (!newPost) {
            return
        }

        NewPost(jwt, newPost).then(result => {
            if (!result.text) {
                return
            }
            
            setPosts(posts.concat(result))
        })
    }

    return (
        <>
            { isAuthenticated && (<CreatePost onNewPost={appendPost}/> )}
            <ul>{posts.sort((a,b) => a.created < b.created ? 1:-1).map(post => <PostItem key={post.PK+post.SK} post={post}/>)}</ul>
        </>
    );
}

export function PostItem({post}: {post:Post}) {
    let date = parseDate(post.created)

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

function parseDate(created: string) : string {
    let date = new Date(created)
    let day = date.getDate()
    let month = date.toLocaleString('default', { month: "long" })
    let year = date.getFullYear()

    return day + " " + month + " " + year
}


export function CreatePost({onNewPost}: any) {

    const [newPost, setNewPost] = useState("")
    const auth = useAuth();

    const appendPost = () => {
        if (!auth.isAuthenticated) {
            auth.signinRedirect()
        }
        onNewPost(auth.user?.id_token, newPost)
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