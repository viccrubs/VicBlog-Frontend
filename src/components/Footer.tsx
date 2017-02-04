import * as React from 'react';


interface FooterProps {

}

export const Footer: React.StatelessComponent<FooterProps> = (props: FooterProps) => {
    return <footer style={{ textAlign: "center" }}>
        <p>Code by <a href="https://github.com/viccrubs">VicCrubs</a>.</p>
        <p>FrontEnd <a href="https://github.com/viccrubs/VicBlog-Frontend">Github Repository</a>.</p>
        <p>BackEnd <a href="https://github.com/viccrubs/VicBlog-Backend">Github Repository</a>. </p>
    </footer>
}