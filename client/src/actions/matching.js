//import { notifSocket } from './socket'

export const SAVE_MATCHING = 'SAVE_MATCHING'
export const UPDATE_MATCHING = 'UPDATE_MATCHING'
export const UPDATE_MATCHING2 = 'UPDATE_MATCHING2'
export const UPDATE_AGE = 'UPDATE_AGE'
export const UPDATE_POP = 'UPDATE_POP'
export const UPDATE_DIST = 'UPDATE_DIST'
export const UPDATE_SEARCH = 'UPDATE_SEARCH'
export const UPDATE_PAGE = 'UPDATE_PAGE'
export const UPDATE_MM = 'UPDATE_MM'
export const USE_SAVE = 'USE_SAVE'
export const FIRST_MATCHING = 'FIRST_MATCHING'
export const SEL_TAG = 'SEL_TAG'
export const NEW_TAG = 'NEW_TAG'
export const CHANGE = 'CHANGE'
export const SORT = 'SORT'

function calculateAge(birthday){ 
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

export function firstMatching(users) {
  return ((dispatch) => {
    var min = {pop: Math.min.apply(Math,users.map(function(o){return o.score;})), age: Math.max.apply(Math,users.map(function(o){return new Date(o.birthdate);}))}
    var max = {dist: Math.max.apply(Math,users.map(function(o){return o.dist;})), pop: Math.max.apply(Math,users.map(function(o){return o.score;})), age: Math.min.apply(Math,users.map(function(o){return new Date(o.birthdate);}))}
    dispatch(updateMinMax(min, max))
    dispatch(updateAge([calculateAge(new Date(min.age)), calculateAge(new Date(max.age))]))
    dispatch(updatePop([min.pop, max.pop]))
    dispatch(updateDist([0, max.dist]))
    dispatch(matching(users))
    dispatch(change(false))
  })
}

function matching(users) {
  return {
    type: FIRST_MATCHING,
    users
  }
}




export function saveMatching(users) {
  return ((dispatch) => {
    var min = {pop: Math.min.apply(Math,users.map(function(o){return o.score;})), age: Math.max.apply(Math,users.map(function(o){return new Date(o.birthdate);}))}
    var max = {dist: Math.max.apply(Math,users.map(function(o){return o.dist;})), pop: Math.max.apply(Math,users.map(function(o){return o.score;})), age: Math.min.apply(Math,users.map(function(o){return new Date(o.birthdate);}))}
    dispatch(updateMinMax(min, max))
    dispatch(updateAge([calculateAge(new Date(min.age)), calculateAge(new Date(max.age))]))
    dispatch(updatePop([min.pop, max.pop]))
    dispatch(updateDist([0, max.dist]))
    dispatch(putMatching(users))

  })
}

function putMatching(users) {
  return {
    type: SAVE_MATCHING,
    users
  }
}




export function updateMatching(old, users) {
  return ((dispatch) => {
    var concat = old.concat(users)
    var min = {pop: Math.min.apply(Math,concat.map(function(o){return o.score;})), age: Math.max.apply(Math,concat.map(function(o){return new Date(o.birthdate);}))}
    var max = {dist: Math.max.apply(Math,concat.map(function(o){return o.dist;})), pop: Math.max.apply(Math,concat.map(function(o){return o.score;})), age: Math.min.apply(Math,concat.map(function(o){return new Date(o.birthdate);}))}
    dispatch(updateMinMax(min, max))
    dispatch(updateAge([calculateAge(new Date(min.age)), calculateAge(new Date(max.age))]))
    dispatch(updatePop([min.pop, max.pop]))
    dispatch(updateDist([0, max.dist]))
    dispatch(concatMatching(users))

  })
}

function concatMatching(users) {
  return {
    type: UPDATE_MATCHING,
    users
  }
}





export function useSave(users) {
  return ((dispatch) => {
    var min = {pop: Math.min.apply(Math,users.map(function(o){return o.score;})), age: Math.max.apply(Math,users.map(function(o){return new Date(o.birthdate);}))}
    var max = {dist: Math.max.apply(Math,users.map(function(o){return o.dist;})), pop: Math.max.apply(Math,users.map(function(o){return o.score;})), age: Math.min.apply(Math,users.map(function(o){return new Date(o.birthdate);}))}
    dispatch(updateMinMax(min, max))
    dispatch(updateAge([calculateAge(new Date(min.age)), calculateAge(new Date(max.age))]))
    dispatch(updatePop([min.pop, max.pop]))
    dispatch(updateDist([0, max.dist]))
    dispatch(updatePage(0))
    dispatch(disSave())

  })
}

function disSave() {
  return {
    type: USE_SAVE
  }
}

export function updateFilter(usersFilter) {
  return {
    type: UPDATE_MATCHING2,
    usersFilter
  }
}

export function updateAge(age) {
  return {
    type: UPDATE_AGE,
    age
  }
}

export function updatePop(pop) {
  return {
    type: UPDATE_POP,
    pop
  }
}

export function updateDist(dist) {
  return {
    type: UPDATE_DIST,
    dist
  }
}

export function updateSearch(search) {
  return {
    type: UPDATE_SEARCH,
    search
  }
}

export function updatePage(page) {
  return {
    type: UPDATE_PAGE,
    page
  }
}

function updateMinMax(min, max) {
  return {
    type: UPDATE_MM,
    min,
    max
  }
}

export function newTag(tag) {
  return {
    type: NEW_TAG,
    tag
  }
}

export function selTag(tag) {
  return {
    type: SEL_TAG,
    tag
  }
}

export function change(bool) {
  return {
    type: CHANGE,
    bool
  }
}

export function sort(sort) {
  return {
    type: SORT,
    sort
  }
}

