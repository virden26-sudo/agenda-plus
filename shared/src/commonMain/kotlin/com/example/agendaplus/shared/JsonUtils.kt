package com.example.agendaplus.shared

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import com.google.gson.reflect.TypeToken

object JsonUtilsShared {
    private val gson = Gson()

    fun fromJson(json: String): List<AgendaItemResponseShared> {
        return try {
            gson.fromJson(json, object : TypeToken<List<AgendaItemResponseShared>>() {}.type)
        } catch (e: JsonSyntaxException) {
            emptyList()
        }
    }
}
