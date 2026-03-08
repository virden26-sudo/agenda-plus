package com.example.agendaplus

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class AgendaItem(
    val type: ItemType,
    val title: String,
    val dueDate: String,
    val details: String
) : Parcelable
