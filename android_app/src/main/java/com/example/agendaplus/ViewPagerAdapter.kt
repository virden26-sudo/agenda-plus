package com.example.agendaplus

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter

class ViewPagerAdapter(activity: FragmentActivity, private val items: List<AgendaItem>) : FragmentStateAdapter(activity) {

    override fun getItemCount(): Int = 3

    override fun createFragment(position: Int): Fragment {
        return when (position) {
            0 -> AgendaFragment.newInstance(items.filter { it.type == ItemType.ASSIGNMENT })
            1 -> AgendaFragment.newInstance(items.filter { it.type == ItemType.EXAM })
            else -> AgendaFragment.newInstance(items.filter { it.type == ItemType.NOTE })
        }
    }
}
