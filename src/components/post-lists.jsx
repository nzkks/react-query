import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchPosts } from '../api/api';
import Post from './Post';
import PostForm from './PostForm';
import Pagination from './Pagination';

const PostLists = () => {
  const [page, setPage] = useState(1);

  const postsQueryKey = ['posts', { page }];

  const {
    status: fetchPostsStatus,
    data: postData,
    error: fetchPostsError
  } = useQuery({ queryKey: postsQueryKey, queryFn: () => fetchPosts(page) });
  // If queryFn recieves out side variables as Parameters. useQuery needs to be informed of that change through adding the variables into queryKey options.

  // Setting staleTime wil make sure the query will be executed during that time. During that specified time, data in the cache will be used.

  // If auto refetching is needed every n seconds add refetchInterval in the useQuery

  // When a query's cache becomes unused or inactive, that cache data will be garbage collected after gcTime duration. Default value is Infinity which disables manual garbage collection and will automatically clear memory once a request has finished. If not Infinity, manual garbage collection is needed. Recommended lower value is not less than 2 seconds (1000 * 2)

  if (fetchPostsStatus === 'pending') {
    return <p>Loading...</p>;
  }

  if (fetchPostsStatus === 'error') {
    return <p>Fetch Posts Error: {fetchPostsError.message}</p>;
  }

  return (
    <div className="container">
      <PostForm postsQueryKey={postsQueryKey} />

      <Pagination data={postData} page={page} setPage={setPage} />

      {postData?.data.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostLists;
