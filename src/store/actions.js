import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/utils'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 插入歌曲
export const insertSong = function({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  const currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  const fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲,所以索引要+1
  currentIndex++
  // 插入这首歌到当前列表
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.split(fpIndex, 1)
      currentIndex--
    } else {
      playlist.split(fpIndex + 1, 1)
    }
  }

  const curerntSIndex = findIndex(sequenceList, currentSong) + 1

  const fsIndex = findIndex(sequenceList, song)

  sequenceList(curerntSIndex, 0, song)

  if (fsIndex > -1) {
    if (curerntSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

export const saveSearchHistory = function({ commit, query }) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({ commit, query }) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  const sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function({ commit }) {
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({ commit }, song) {
  commit(types.SET_PLAYING_STATE, savePlay(song))
}

export const saveFavoriteList = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
