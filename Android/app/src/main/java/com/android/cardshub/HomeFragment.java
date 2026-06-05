package com.android.cardshub;

import android.content.Context;
import android.content.SharedPreferences;
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

import java.util.Locale;

/**
 * Support v4 Fragment mirroring elements of our Home Tab.
 * Renders Weather & Fitness widgets with custom actions, shadows, and status.
 */
public class HomeFragment extends Fragment {

    private int mStepsCount = 6420;
    private TextView mTvSteps;
    private TextView mTvWeatherTemp;
    private TextView mTvWeatherLocation;
    private SharedPreferences mPrefs;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        mPrefs = getActivity().getSharedPreferences("android_hub_prefs", Context.MODE_PRIVATE);
        mStepsCount = mPrefs.getInt("steps_logged", 6420);

        // Bind interactive widget items
        mTvSteps = view.findViewById(R.id.steps_count_display);
        mTvWeatherTemp = view.findViewById(R.id.weather_temp);
        mTvWeatherLocation = view.findViewById(R.id.weather_location);

        updateStepsDisplay();

        // Weather search button behavior
        final EditText etWeatherSearch = view.findViewById(R.id.weather_search_input);
        Button btnWeatherSearch = view.findViewById(R.id.btn_weather_search);
        btnWeatherSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String query = etWeatherSearch.getText().toString().trim();
                if (!query.isEmpty()) {
                    mTvWeatherLocation.setText(query + ", World");
                    mTvWeatherTemp.setText("75°F");
                    etWeatherSearch.setText("");
                }
            }
        });

        // Step accumulator buttons
        Button btnAdd500 = view.findViewById(R.id.btn_fitness_add_500);
        Button btnAdd1500 = view.findViewById(R.id.btn_fitness_add_1000);

        btnAdd500.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addSteps(500);
            }
        });

        btnAdd1500.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addSteps(1500);
            }
        });

        return view;
    }

    private void addSteps(int count) {
        mStepsCount += count;
        mPrefs.edit().putInt("steps_logged", mStepsCount).apply();
        updateStepsDisplay();
    }

    private void updateStepsDisplay() {
        if (mTvSteps != null) {
            mTvSteps.setText(String.format(Locale.US, "%,d / 10,000", mStepsCount));
        }
    }
}
