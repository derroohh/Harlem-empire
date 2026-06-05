package com.android.cardshub;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

/**
 * Fragment containing active User details logs.
 */
public class AccountFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_account, container, false);

        Button btnSignOut = view.findViewById(R.id.btn_profile_signout);
        btnSignOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Return to launcher login screen inside MainActivity
                if (getActivity() != null) {
                    getActivity().findViewById(R.id.login_card_root).setVisibility(View.VISIBLE);
                    getActivity().findViewById(R.id.android_screen_workspace).setVisibility(View.GONE);
                    getActivity().findViewById(R.id.bottom_navigation).setVisibility(View.GONE);
                    Toast.makeText(getContext(), "Logged out!", Toast.LENGTH_SHORT).show();
                }
            }
        });

        return view;
    }
}
