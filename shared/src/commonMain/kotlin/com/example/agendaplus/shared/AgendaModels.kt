package com.example.agendaplus.shared

enum class ItemTypeShared {
    ASSIGNMENT, TASK, GRADE, EVENT, STUDY, LIVE, DISCUSSION, QUIZ, ANNOUNCEMENT
}

data class AgendaItemShared(
    val id: Long,
    val title: String,
    val description: String,
    val time: String,
    val type: ItemTypeShared
)

data class AgendaItemResponseShared(
    val title: String,
    val description: String,
    val date: String,
    val type: ItemTypeShared
)
