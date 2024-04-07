const Posts = ({ data }) => {
  return (
    <>
      {data?.map(post => (
        <div key={post.id} className="post">
          <div>{post.title}</div>
          {post.tags.map(tag => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ))}
    </>
  );
};

export default Posts;
