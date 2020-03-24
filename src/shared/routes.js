/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import Home         from "./pages/home";
import News         from './pages/news';
import Rankings     from './pages/ranking';
import Albums       from './pages/albums';
import AlbumInfo    from './pages/albums/info';
import Artists      from './pages/artists';
import ArtistsInfo  from './pages/artists/info';
import Login        from './pages/login';
import Myaccount    from './pages/myaccount';
import Test         from './pages/test';

const common = [
  {
    path         : "/",
    exact        : true,
    component    : Home,
  },
  {
    path         : "/news",
    component    : News
  },
  {
    path         : "/ranking",
    component    : Rankings
  },
  {
    path         : "/albums/:id",
    exact        : true,
    component    : AlbumInfo
  },
  {
    path         : "/albums",
    exact        : true,
    component    : Albums
  },
  {
    path         : "/artists/:id",
    exact        : true,
    component    : ArtistsInfo
  },
  {
    path         : "/artists",
    exact        : true,
    component    : Artists,
  },
  {
    path         : "/account",
    component    : Login
  },
  {
    path         : "/myaccount",
    component    : Myaccount
  },
  {
    path         : "/test",
    component    : Test
  }
];

export default [ ...common ];
