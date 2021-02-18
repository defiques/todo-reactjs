import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AppHeader from './components/app-header';
import TodoList from './components/todo-list';
import SearchPanel from './components/search-panel';
import ItemStatusFilter from './components/item-status-filter';
import ItemAddForm from './components/item-add-form';

import './index.css';


export default class App extends Component {


    maxId = 1;

    state = {
        items: [
            this.createNewItem('Выпить кофе'),
            this.createNewItem('Сделать приложение'),
            this.createNewItem('Пойти погулять')
        ],
        filter: 'all',
        search: ''
    };

    createNewItem(label) {

        return (
            {
                label,
                important: false,
                done: false,
                id: this.maxId++
            }
        )
    };

    deleteItem = (id) => {

        this.setState(({ items} ) => {

            const idEl = items.findIndex((el) => el.id === id);

            const newData = [
                ...items.slice(0, idEl),
                ...items.slice(idEl + 1)
            ];

            return {
                items: newData
            };
        });


    };

    addItem = (text) => {

        this.setState(( { items }) => {


            const newItem = this.createNewItem(text);

            const newData = [...items, newItem];

            return {
                items: newData
            }


        })

    };

    toggleProp(arr, id, prop) {

        const idEl = arr.findIndex((el) => el.id === id);
        const oldItem = arr[idEl];
        const newItem = {...oldItem, [prop]: !oldItem[prop]};

        return [...arr.slice(0, idEl),
            newItem,
            ...arr.slice(idEl + 1)]
    }



    onToggleImportant = (id) => {

        this.setState(( { items} ) => {

            return {
                items: this.toggleProp(items, id, 'important')
            }
        })

    };

    onToggleDone = (id) => {

        this.setState(( { items} ) => {

            return {
                items: this.toggleProp(items, id, 'done')
            }
        })
    };

    onFilterChange = (filter) => {
        this.setState({ filter });
    };

    onSearchChange = (search) => {
        this.setState({ search });
    };

    filterItems(items, filter) {
        if (filter === 'all') {
            return items;
        } else if (filter === 'active') {
            return items.filter((item) => (!item.done));
        } else if (filter === 'done') {
            return items.filter((item) => item.done);
        }
    }

    searchItems(items, search) {
        if (search.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
    }


    render() {

        const doneCount = this.state.items.filter((el) => el.done).length;

        const todoCount = this.state.items.length - doneCount;

        const { items, filter, search } = this.state;
        const visibleItems = this.searchItems(this.filterItems(items, filter), search);
        return (
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount}/>
                <div className="top-panel d-flex">
                    <SearchPanel onSearchChange={this.onSearchChange}/>
                    <ItemStatusFilter filter={filter}
                                      onFilterChange={this.onFilterChange} />
                </div>
                <TodoList items={ visibleItems }
                          onDeleted={this.deleteItem}
                          onToggleImportant={this.onToggleImportant}
                          onToggleDone={this.onToggleDone}/>

                <ItemAddForm onAdd={this.addItem}/>
            </div>
        );
    }
};


ReactDOM.render(<App/>, document.getElementById("root"));
