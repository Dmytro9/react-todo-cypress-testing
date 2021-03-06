import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Footer from "./Footer";
import { saveTodo, loadTodos, destroyTodo, updateTodo } from "../lib/service";
import { filterTodos } from "../lib/utils";

export default class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTodo: "",
      todos: [],
    };

    this.handleNewTodoChange = this.handleNewTodoChange.bind(this);
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    loadTodos()
      .then(({ data }) => this.setState({ todos: data }))
      .catch(() => this.setState({ error: true }));
  }

  handleNewTodoChange(e) {
    this.setState({ currentTodo: e.target.value });
  }

  handleTodoSubmit(e) {
    e.preventDefault();
    const newTodo = { name: this.state.currentTodo, isCompleted: false };
    saveTodo(newTodo)
      .then(({ data }) =>
        this.setState({ todos: this.state.todos.concat(data), currentTodo: "" })
      )
      .catch(() => this.setState({ error: true }));
  }

  handleDelete(id) {
    destroyTodo(id).then(() =>
      this.setState({
        todos: this.state.todos.filter((todo) => todo.id !== id),
      })
    );
  }

  handleToggle(id) {
    const targetTodo = this.state.todos.find((t) => t.id === id);
    const updated = {
      ...targetTodo,
      isCompleted: !targetTodo.isCompleted,
    };

    updateTodo(updated).then(({ data }) => {
      const todos = this.state.todos.map((t) => (t.id === data.id ? data : t));
      this.setState({ todos: todos });
    });
  }

  render() {
    const remaining = this.state.todos.filter(
      (todo) => !todo.isCompleted
    ).length;

    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error ? <span className="error">Oh no!</span> : null}
            <TodoForm
              currentTodo={this.state.currentTodo}
              handleNewTodoChange={this.handleNewTodoChange}
              handleTodoSubmit={this.handleTodoSubmit}
            />
          </header>
          <section className="main">
            <Route
              path="/:filter?"
              render={({ match }) => (
                <TodoList
                  todos={filterTodos(match.params.filter, this.state.todos)}
                  handleDelete={this.handleDelete}
                  handleToggle={this.handleToggle}
                />
              )}
            />
          </section>
          <Footer remaining={remaining} />
        </div>
      </Router>
    );
  }
}
