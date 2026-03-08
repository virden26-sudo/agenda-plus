package com.example.agendaplus.shared

data class AgendaItemResponseShared(
    val title: String,
    val description: String,
    val date: String,
    val type: ItemTypeShared
)
