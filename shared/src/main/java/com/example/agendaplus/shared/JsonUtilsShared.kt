package com.example.agendaplus.shared

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

object JsonUtilsShared {
    private val gson = Gson()

    fun fromJsonToAgendaItemList(json: String): List<AgendaItemResponseShared> {
        val type = object : TypeToken<List<AgendaItemResponseShared>>() {}.type
        return gson.fromJson(json, type)
    }
}
