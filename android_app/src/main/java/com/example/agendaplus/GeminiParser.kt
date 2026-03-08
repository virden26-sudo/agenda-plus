package com.example.agendaplus

import com.google.ai.client.generativeai.GenerativeModel
import com.google.gson.Gson

class GeminiParser(apiKey: String) {

    private val generativeModel = GenerativeModel(
        modelName = "gemini-1.5-flash",
        apiKey = apiKey
    )

    suspend fun parseText(text: String): List<AgendaItem> {
        val prompt = "Parse the following text and extract agenda items. The output should be a JSON array of objects, where each object has 'type' (ASSIGNMENT, EXAM, or NOTE), 'title', 'dueDate', and 'details'. Return ONLY the raw JSON array, no markdown formatting.\n\n$text"
        val response = generativeModel.generateContent(prompt)
        val cleanJson = response.text?.trim()?.removeSurrounding("```json", "```")?.trim() ?: "[]"
        val gson = Gson()
        return try {
            gson.fromJson(cleanJson, Array<AgendaItem>::class.java).toList()
        } catch (e: Exception) {
            emptyList()
        }
    }
}
