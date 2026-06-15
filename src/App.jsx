import Header from "./components/Header";
import Counter from "./components/Counter";
import UserList from "./components/UserList";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Counter />
        <UserList />
      </main>
    </div>
  );
}

export default App;
