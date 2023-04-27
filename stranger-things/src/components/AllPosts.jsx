import { useState, useEffect } from "react";
import { fetchAllPost, deletePosts } from "../API/api";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AllPosts() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const { token, user } = useAuth();
  const navigate = useNavigate();

  async function getPost() {
    const postList = await fetchAllPost();
    setData(postList.data.posts);
  }

  useEffect(() => {
    getPost();
  }, []);

  function postSearch(post, search) {
    return (
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  const filteredPosts = data.filter((post) => postSearch(post, search));

  return (
    <div className="all-post">
      <input className="searchBar" 
      type="text" 
      placeholder="Search" 
      onChange={(e) => setSearch(e.target.value)} />

      {filteredPosts.map((post) => {
        return (
          <div className="post" key={post._id}>
            <h1 className="post-username">
              Username: {post.author.username}
            </h1>
            <h2 className="post-title">Title: {post.title}</h2>
            <p className="post-description">{post.description}</p>
            <h5 className="post-price">Price: {post.price}</h5>
            <div className="btn-container">
              {token && (
                <Link to={`${post._id}/messages`}>
                  <button className="message-post-btn">Message</button>
                </Link>
              )}
              {user._id === post.author._id && token && (
                <button
                  className="delete-post-btn"
                  onClick={async (e) => {
                    e.preventDefault();
                    await deletePosts(token, post._id);
                    window.location.reload();
                  }}
                >
                  Delete Post
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
