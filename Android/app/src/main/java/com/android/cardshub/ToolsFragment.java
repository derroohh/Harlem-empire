package com.android.cardshub;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

/**
 * Fragment containing our high contrast calculator utility logic.
 */
public class ToolsFragment extends Fragment implements View.OnClickListener {

    private TextView mTvDisplay;
    private StringBuilder mEquation = new StringBuilder();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_tools, container, false);

        mTvDisplay = view.findViewById(R.id.tv_calc_display);

        // Map buttons
        int[] buttonIds = {
            R.id.btn_0, R.id.btn_1, R.id.btn_2, R.id.btn_3, R.id.btn_4,
            R.id.btn_5, R.id.btn_6, R.id.btn_7, R.id.btn_8, R.id.btn_9,
            R.id.btn_add, R.id.btn_sub, R.id.btn_mul, R.id.btn_div,
            R.id.btn_clear, R.id.btn_equals
        };

        for (int id : buttonIds) {
            View btn = view.findViewById(id);
            if (btn != null) {
                btn.setOnClickListener(this);
            }
        }

        return view;
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();
        if (id == R.id.btn_clear) {
            mEquation.setLength(0);
            mTvDisplay.setText("0");
        } else if (id == R.id.btn_equals) {
            calculate();
        } else {
            Button btn = (Button) v;
            mEquation.append(btn.getText().toString());
            mTvDisplay.setText(mEquation.toString());
        }
    }

    private void calculate() {
        // Simple demonstration of string evaluation
        String expr = mEquation.toString();
        if (expr.isEmpty()) return;
        try {
            // For safety and minimalism, we simulate standard equation completion
            int result = 0;
            if (expr.contains("+")) {
                String[] parts = expr.split("\\+");
                result = Integer.parseInt(parts[0]) + Integer.parseInt(parts[1]);
            } else if (expr.contains("-")) {
                String[] parts = expr.split("-");
                result = Integer.parseInt(parts[0]) - Integer.parseInt(parts[1]);
            } else {
                result = Integer.parseInt(expr);
            }
            mTvDisplay.setText(String.valueOf(result));
            mEquation.setLength(0);
            mEquation.append(result);
        } catch (Exception e) {
            mTvDisplay.setText("Error");
            mEquation.setLength(0);
        }
    }
}
