package com.example.agendaplus.shared.chat

interface ChatClient {
    suspend fun sendMessage(prompt: String, apiKey: String, endpointUrl: String? = null): String
}
