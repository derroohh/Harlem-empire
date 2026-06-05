package com.android.cardshub;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Support v4 Fragment mirroring elements of our Keep Notes & Schedules (Discover Tab)
 */
public class DiscoverFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_discover, container, false);

        final EditText etNoteInput = view.findViewById(R.id.et_note_input);
        Button btnSaveNote = view.findViewById(R.id.btn_save_note);
        final TextView tvNotesDisplay = view.findViewById(R.id.tv_notes_display);

        btnSaveNote.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String text = etNoteInput.getText().toString().trim();
                if (!text.isEmpty()) {
                    String currentNotes = tvNotesDisplay.getText().toString();
                    tvNotesDisplay.setText("- " + text + "\n" + currentNotes);
                    etNoteInput.setText("");
                    Toast.makeText(getContext(), "Note logged!", Toast.LENGTH_SHORT).show();
                }
            }
        });

        return view;
    }
}
