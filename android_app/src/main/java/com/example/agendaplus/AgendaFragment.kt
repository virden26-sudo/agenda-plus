package com.example.agendaplus

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class AgendaFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: AgendaAdapter
    private var items: List<AgendaItem> = emptyList()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_agenda, container, false)
        recyclerView = view.findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(context)
        adapter = AgendaAdapter(items)
        recyclerView.adapter = adapter
        return view
    }

    override fun setArguments(args: Bundle?) {
        super.setArguments(args)
        items = args?.getParcelableArrayList("items") ?: emptyList()
    }

    companion object {
        fun newInstance(items: List<AgendaItem>): AgendaFragment {
            val fragment = AgendaFragment()
            val args = Bundle()
            args.putParcelableArrayList("items", ArrayList(items))
            fragment.arguments = args
            return fragment
        }
    }
}
