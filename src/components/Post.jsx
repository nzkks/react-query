const Post = ({ post }) => {
  return (
    <div className="post">
      <div>{post.title}</div>
      {post.tags.map(tag => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
};

export default Post;
