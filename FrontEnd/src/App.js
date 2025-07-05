import React, { Suspense } from 'react';
import {BrowserRouter as Router , Route , Redirect , Switch} from 'react-router-dom';
//import User from './user/pages/User';
import MainNavigation from './shared/Navigation/MainNavigation';
//import UserPlaces from './places/pages/UserPlaces';
//import NewPlace from './places/pages/NewPlace';
//import UpdatePlace from './places/pages/UpdatePlace';
//import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const User = React.lazy(() => import('./user/pages/User'));

const UserPlaces = React.lazy(()=>import('./places/pages/UserPlaces'));
const NewPlace = React.lazy(()=>import('./places/pages/NewPlace'));
const UpdatePlace = React.lazy(()=>import('./places/pages/UpdatePlace'));
const Auth = React.lazy(()=>import('./user/pages/Auth'));



function App() {

    const{token , login , logout , userId} = useAuth();

    let routes;
  
    if (token) {
      routes = (
        <Switch>
          {/* Routes is used now instead of switch(work of both is to direct to the first route below)  */}
           {/* switch is used to stop unnecesary renders without this we were always getting redireacted to / at last even if we were writting /places */}
          <Route path="/" exact>
            <User/>
          </Route>
          <Route path="/places/user/:userId" exact>
            <UserPlaces />
          </Route>
          <Route path="/places/new" exact>
            <NewPlace />
          </Route>
          <Route path="/places/:placeId">
            <UpdatePlace />
          </Route>
          <Redirect to="/" />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route path="/" exact>
            <User />
          </Route>
          <Route path="/places/user/:userId" exact>
            <UserPlaces />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
          <Redirect to="/auth" />
        </Switch>
      );
    }

    return (

    <AuthContext.Provider value={{isLoggedIn : !!token ,userId : userId , token : token ,login:login , logout:logout}}>
    {/* {now every route inside the router has the access to authcontext} */}
    <Router>

      <MainNavigation/>
      <main>
        <Suspense fallback={<div className='center'><LoadingSpinner/></div>}>
      {routes}
    </Suspense>


      
      </main>
    </Router>
    </AuthContext.Provider>

  );

};

export default App;
