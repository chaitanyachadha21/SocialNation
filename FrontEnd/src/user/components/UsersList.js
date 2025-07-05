import React from 'react'
import './UsersList.css';
import UsersItem from './UsersItem';
import Card from '../../shared/components/UIElements/Card';

const UsersList = props => {
  
    
    if(props.items.length === 0)
    {
        return(
            <Card>

            <div className='center'>
                <h1>Nothing to show!</h1></div>
            </Card>
        );
    }

    return(

        <ul className='users-list'>
            {
                props.items.map(user=>
                (
                    <UsersItem 
                    key={user.id}
                    id={user.id}
                    image={user.image}
                    name = {user.name}
                    placecount = {user.places.length}/>
                )
                )
            }
        </ul>
    );
  
}

export default UsersList
