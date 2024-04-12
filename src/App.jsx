import './App.css';
import InfinitePosts from './components/InfinitePosts';
// import PostLists from './components/post-lists';

function App() {
  return (
    <div>
      <h2 className="title">My Posts</h2>
      {/* <PostLists /> */}
      <InfinitePosts />
    </div>
  );
}

export default App;
