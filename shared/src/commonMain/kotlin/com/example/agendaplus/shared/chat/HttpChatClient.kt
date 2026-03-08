package com.example.agendaplus.shared.chat

import com.google.gson.Gson
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.header

data class ChatRequest(val prompt: String)

class HttpChatClient(private val client: HttpClient? = null) : ChatClient {
    private val gson = Gson()
    private val http = client ?: HttpClient()
    private val defaultLocal = "http://localhost:3000/generate"

    override suspend fun sendMessage(prompt: String, apiKey: String, endpointUrl: String?): String {
        val target = if (endpointUrl.isNullOrBlank()) defaultLocal else endpointUrl
        val req = ChatRequest(prompt)
        val json = gson.toJson(req)
        val response: String = http.post(target) {
            header("Authorization", "Bearer $apiKey")
            header("Content-Type", "application/json")
            setBody(json)
        }.body()
        return response
    }
}
