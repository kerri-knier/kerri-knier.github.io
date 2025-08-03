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
        <section className="posts-section tech-blog-section">
            {isAuthenticated && <CreatePost onNewPost={appendPost} />}
            <ul className="posts-list tech-blog-list">
                {posts.sort((a, b) => a.created < b.created ? 1 : -1).map(post => (
                    <PostItem key={post.PK + post.SK} post={post} />
                ))}
            </ul>
        </section>
    );
}

export function PostItem({post}: {post:Post}) {
    let date = parseDate(post.created)
    return (
        <li className="post-item tech-blog-card">
            <div className="post-meta">
                <span className="date">{date}</span>
            </div>
            <div className="post-content">
                {post.text.replaceAll('"','').replaceAll('\\n','\n')}
            </div>
        </li>
    );
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
        <form className="postForm" onSubmit={e => { e.preventDefault(); appendPost(); }}>
            <textarea
                className="postInput"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                rows={3}
                maxLength={500}
                style={{
                    minWidth: 0,
                    flex: 1,
                    borderRadius: '12px',
                    border: '1.5px solid #6366f1',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    background: '#f7f8fa',
                    boxShadow: '0 1px 4px rgba(99,102,241,0.04)',
                    transition: 'border 0.2s',
                    resize: 'vertical',
                }}
            />
            <button
                className="modern-btn postButton"
                type="submit"
                style={{
                    minWidth: 100,
                    height: 44,
                    fontSize: '1rem',
                    borderRadius: 8,
                    border: 'none',
                    margin: 0,
                    boxShadow: 'none',
                    alignSelf: 'flex-end',
                }}
            >
                Post
            </button>
        </form>
    );
}