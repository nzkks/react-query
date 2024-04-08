import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/api';
import Posts from './Posts';
import PostForm from './PostForm';

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

      <div className="pages">
        <button onClick={() => setPage(oldPage => Math.max(oldPage - 1, 0))} disabled={!postData.prev}>
          Previous page
        </button>
        {/* Math.max takes the seconds parameter. 0 means if the first parameter value goes beyond (less than) 0, then it is set to 0. */}
        <div>{page}</div>
        <button onClick={() => setPage(oldPage => oldPage + 1)} disabled={!postData.next}>
          Next page
        </button>
      </div>

      <Posts data={postData?.data} />
    </div>
  );
};

export default PostLists;
